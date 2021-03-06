// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationConfigurationFactory } from '../../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../../common/react/named-sfc';
import { VisualizationType } from '../../../common/types/visualization-type';
import { BaseLeftNav, onBaseLeftNavItemClick } from '../base-left-nav';
import { LeftNavIndexIcon } from './left-nav-icon';
import { AssessmentLinkBuilderDeps, LeftNavLinkBuilder, OverviewLinkBuilderDeps } from './left-nav-link-builder';

export type VisualizationBasedLeftNavDeps = {
    leftNavLinkBuilder: LeftNavLinkBuilder;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
} & OverviewLinkBuilderDeps &
    AssessmentLinkBuilderDeps;

export type VisualizationBasedLeftNavProps = {
    deps: VisualizationBasedLeftNavDeps;
    selectedKey: string;
    onLinkClick: onBaseLeftNavItemClick;
    visualizations: VisualizationType[];
};

export const VisualizationBasedLeftNav = NamedSFC<VisualizationBasedLeftNavProps>('VisualizationBasedLeftNav', props => {
    const { deps, selectedKey, onLinkClick, visualizations } = props;

    const { leftNavLinkBuilder, visualizationConfigurationFactory } = deps;

    const links = [];
    visualizations.forEach((visualizationType, index) => {
        const config = visualizationConfigurationFactory.getConfiguration(visualizationType);
        links.push(leftNavLinkBuilder.buildVisualizationConfigurationLink(config, onLinkClick, visualizationType, index + 1));
    });

    return <BaseLeftNav renderIcon={link => <LeftNavIndexIcon item={link} />} selectedKey={selectedKey} links={links} />;
});
