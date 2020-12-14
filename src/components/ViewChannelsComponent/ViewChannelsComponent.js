import React, { useEffect, useState } from 'react';
import { Button } from 'devextreme-react/button';

import './ViewChannelsComponent.scss'

export default function ViewChannelsComponent (props) {
  const { data, channels } = props;

  const [view, setView] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    let view = [];

    channels.forEach(channel => {
      view.push(<div key={channel.channel_id} className={'channel'}>{data[channel.channel_id]}</div>)
    });
    
    setView(view);
  }, []);

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