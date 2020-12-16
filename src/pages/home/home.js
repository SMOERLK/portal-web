import React from 'react';
import './home.scss';

export default () => (
  <React.Fragment>
    <h2 className={'content-block'}>Home</h2>
    <div className={'content-block'}>
      <div className={'dx-card responsive-paddings'}>
        <div className={'logos-container'}>
          <img className={'state-emblem'} src={'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Emblem_of_Sri_Lanka.svg/1200px-Emblem_of_Sri_Lanka.svg.png'} />
        </div>

        <h6>
          To ensure students in Sri Lanka continue to receive an education during the COVID-19 pandemic period,
          the State Ministry of Education Reforms has endeavored to roll out a comprehensive distance learning program.
        </h6>

        <h6>
          To commence their work, the Ministry of Education requires some baseline information about students,
          their families and the possible media through which lessons can take place in addition to online learning
          such as radio and tv which may be more accessible to students who cannot access strong internet bandwidth
          connections.
        </h6>
        
      </div>
    </div>
  </React.Fragment>
);
