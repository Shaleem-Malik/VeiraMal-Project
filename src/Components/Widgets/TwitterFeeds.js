/**
 * Twitter Feeds Widget
 */
import React from 'react';
import { Timeline } from 'react-twitter-widgets'

function TwitterFeed() {
   return (
      <Timeline
         dataSource={{
            sourceType: 'profile',
            screenName: 'envato'
         }}
         options={{
            username: 'envato',
            height: '400'
         }}
      />
   );
}

export default TwitterFeed;