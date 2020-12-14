import React, { useEffect, useState } from 'react';
import './profile.scss';
import Form from 'devextreme-react/form';

export default () => {
  const [notes, setNotes] = useState(
    'Sandra is a CPA and has been our controller since 2008. She loves to interact with staff so if you`ve not met her, be certain to say hi.\r\n\r\nSandra has 2 daughters both of whom are accomplished gymnasts.'
  );
  const [profile, setProfile] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const data = user.data;

    const profile = {
      OpenemisID: data.openemis_no,
      FirstName: data.first_name,
      MiddleName: data.middle_name,
      Address: data.address,
      BirthDate: data.date_of_birth,
      LastLogin: data.last_login
    }

    setProfile(profile);
    setData(data);
  }, [])



  const employee = {
    OpenemisID: 7,
    FirstName: 'Sandra',
    LastName: 'Johnson',
    Prefix: 'Mrs.',
    Position: 'Controller',
    Picture: 'images/employees/06.png',
    BirthDate: new Date('1974/11/15'),
    HireDate: new Date('2005/05/11'),
    Notes: notes,
    Address: '4600 N Virginia Rd.'
  };

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Profile</h2>

      {Object.keys(profile).length && <div>
        <div className={'content-block dx-card responsive-paddings top-container'}>
          <img className={'avatar'} src={data.avatarUrl} />
        </div>

        <div className={'content-block dx-card responsive-paddings'}>
          <Form
            readOnly={true}
            id={'form'}
            defaultFormData={profile}
            onFieldDataChanged={e => e.dataField === 'Notes' && setNotes(e.value)}
            labelLocation={'top'}
            colCountByScreen={colCountByScreen}
          />
        </div>
      </div>}
    </React.Fragment>
  );
};

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4
};
