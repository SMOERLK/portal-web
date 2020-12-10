import React, { useEffect, useState } from 'react';
import { Button } from 'devextreme-react/button';

import './multiple-data-reducer.scss'

export default function (props) {
  const data = ["Rupavahini", "Hiru TV", "TV Derana", "Sirasa TV", "ITN"];

  const [view, setView] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setView(
      data.map(element => <div>{element}</div>)
    )
  }, []);

  return (
    <div>
      <div>{showList ?
        <div>
          {view}
          <div className={'btn-txt'} onClick={() => setShowList(false)}>Hide</div>
        </div>
        : 
        <Button
          text={"View (" + data.length + ")"}
          elementAttr={{ class: "view-button" }}
          stylingMode="contained"
          onClick={() => setShowList(true)}
        />
      }</div>
    </div>
  )
}