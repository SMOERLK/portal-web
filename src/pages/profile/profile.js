import React, { useEffect, useState } from 'react';
import Form from 'devextreme-react/form';
import './profile.scss';

export default () => {
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
