// src/components/IdleMonitor.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import api from 'Api';
import AutoLogoutModal from './AutoLogoutModal';
import { logoutUserFromFirebase } from 'Store/Actions';

// Configuration
const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutes
const WARNING_DURATION_MS = 2 * 60 * 1000; // 2 minutes

export default function IdleMonitor() {
    const dispatch = useDispatch();
    const history = useHistory();

    // modal state
    const [showModal, setShowModal] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(Math.round(WARNING_DURATION_MS / 1000));

    // refs to timers (so we can clear)
    const inactivityTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    // reset inactivity timer
    const resetInactivityTimer = () => {
        // hide modal if shown
        if (showModal) {
            clearCountdown();
            setShowModal(false);
        }

        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        inactivityTimerRef.current = setTimeout(() => {
            // show warning modal
            startWarningCountdown();
        }, INACTIVITY_MS);
    };

    // start warning modal + countdown
    const startWarningCountdown = () => {
        setSecondsLeft(Math.round(WARNING_DURATION_MS / 1000));
        setShowModal(true);

        // single timer to auto logout once WARNING_DURATION_MS elapses
        countdownTimerRef.current = setTimeout(() => {
            handleAutoLogout();
        }, WARNING_DURATION_MS);

        // interval to update seconds remaining (for UI)
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    // will be handled by timeout, but ensure UI shows 0
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const clearCountdown = () => {
        if (countdownTimerRef.current) {
            clearTimeout(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
    };

    // user clicked Continue — call API to extend session (refresh token)
    const handleContinue = async () => {
        try {
            // call backend refresh endpoint which returns a new token
            const res = await api.post('Auth/refresh');
            const newToken = res?.data?.token ?? res?.data?.Token ?? null;
            if (newToken) {
                localStorage.setItem('token', newToken);
            }
        } catch (err) {
            // if refresh fails, best to logout (token likely expired)
            console.warn('Session refresh failed:', err);
            // fall through to logout
            await handleLogout();
            return;
        }

        // Reset timers and hide modal
        clearCountdown();
        setShowModal(false);
        resetInactivityTimer();
    };

    // user clicked Cancel manual logout
    // user clicked Cancel manual logout
    const handleLogout = async () => {
        // Close modal and clear timers immediately
        try {
            // stop countdown and inactivity timers
            clearCountdown();
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
                inactivityTimerRef.current = null;
            }

            // hide modal immediately so UI updates before we call logout
            setShowModal(false);

            // dispatch logout (this will call backend revoke, clear localStorage and navigate)
            await dispatch(logoutUserFromFirebase(history));
        } catch (err) {
            console.warn('Logout thunk failed', err);
            // ensure client-side navigation to signin
            try {
                history.push('/signin');
            } catch (navErr) {
                console.warn('Navigation after logout failed', navErr);
            }
        } finally {
            // extra safety: ensure timers are cleared
            clearCountdown();
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
                inactivityTimerRef.current = null;
            }
            // ensure modal state false
            setShowModal(false);
        }
    };

    // auto logout when countdown finishes
    const handleAutoLogout = async () => {
        clearCountdown();
        setShowModal(false);
        await handleLogout();
    };

    // global activity listener
    useEffect(() => {
        const activityHandler = () => {
            resetInactivityTimer();
        };

        // events to consider as activity
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

        events.forEach(e => window.addEventListener(e, activityHandler));

        // start first timer
        resetInactivityTimer();

        return () => {
            // cleanup
            events.forEach(e => window.removeEventListener(e, activityHandler));
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
            clearCountdown();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once

    return (
        <>
            <AutoLogoutModal
                visible={showModal}
                secondsLeft={secondsLeft}
                onContinue={handleContinue}
                onCancel={handleLogout}
            />
        </>
    );
}