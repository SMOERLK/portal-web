import React, { useEffect, useState } from 'react';
import { Button } from 'devextreme-react/button';

import './ViewChannelsComponent.scss'

export default function ViewChannelsComponent (props) {
  const { data, channels } = props;

  const [view, setView] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    let view = [];

    channels.forEach(channel_id => {
      view.push(<div key={channel_id} className={'channel'}>{data[channel_id]}</div>)
    });
    
    setView(view);
  }, []);

  if(!channels.length) {
    return <div className={'not-available'}>N/A</div>
  }

  return (
    <div>
      <div>{showList ?
        <div>
          <div className={'channels-container'}>{view}</div>
          <div className={'btn'} onClick={() => setShowList(false)}>Hide</div>
        </div>
        : 
        <Button
          text={"View (" + channels.length + ")"}
          elementAttr={{ class: "view-button" }}
          stylingMode="contained"
          onClick={() => setShowList(true)}
        />
      }</div>
    </div>
  )
}