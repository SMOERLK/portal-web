import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SideNavOuterToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import routes from './app-routes';

export default function() {
  return (
    <SideNavBarLayout title={'State Ministry of Education Reforms - Sri Lanka'}>
      <Switch>
        {routes.map(({ path, component }) => (
          <Route
            exact
            key={path}
            path={path}
            component={component}
          />
        ))}
        <Redirect to={'/home'} />
      </Switch>
      <Footer>
        Copyright © {new Date().getFullYear()} State Ministry of Education Reforms, Sri Lanka.
      </Footer>
    </SideNavBarLayout>
  );
}
