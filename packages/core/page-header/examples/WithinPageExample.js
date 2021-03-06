// @flow
import React from 'react';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import TextField from '@atlaskit/field-text';
import { StatelessSelect } from '@atlaskit/single-select';
import Page from '@atlaskit/page';

import PageHeader from '../src';

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </BreadcrumbsStateless>
);
const actionsContent = (
  <ButtonGroup>
    <Button appearance="primary">Primary Action</Button>
    <Button>Default</Button>
    <Button>...</Button>
  </ButtonGroup>
);
const barContent = (
  <ButtonGroup>
    <TextField isLabelHidden placeholder="Filter" label="hidden" />
    <StatelessSelect placeholder="Choose an option" />
  </ButtonGroup>
);

export default () => (
  <Page>
    <PageHeader
      breadcrumbs={breadcrumbs}
      actions={actionsContent}
      bottomBar={barContent}
    >
      Title for a Page Header within a page
    </PageHeader>
  </Page>
);
