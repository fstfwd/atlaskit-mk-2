// @flow
import styled, { css } from 'styled-components';
import { borderRadius, colors, gridSize, math } from '@atlaskit/theme';

/* When dropdown contains more than 9 elements (droplist items, droplist groups),
 * it should have scroll and cut off half of the 10th item to indicate that there are more
 * items then are seen. This was previously calculated by mapping over children, but with
 * the current composed API it is simpler to just assume 9 items. */
const getMaxHeight = ({ isTall, maxHeight }) => {
  if (maxHeight) return `${maxHeight}px`;

  const heightWithoutPadding = 17;
  const verticalPadding = gridSize();
  const height = heightWithoutPadding + verticalPadding * 2;
  const defaultMaxHeight = 9.5 * height + verticalPadding / 2;
  return isTall ? '90vh' : `${defaultMaxHeight}px`;
};

const backgroundColor = colors.backgroundOnLayer;
const boxShadow = css`
  box-shadow: 0 ${math.divide(gridSize, 2)}px ${gridSize}px -${math.divide(
        gridSize,
        4,
      )}px ${colors.N50A},
    0 0 1px ${colors.N60A};
`;

export const Content = styled.div`
  background: ${backgroundColor};
  border-radius: ${borderRadius}px;
  ${boxShadow};
  box-sizing: border-box;
  overflow: auto;
  padding: ${math.divide(gridSize, 2)}px 0;
  max-height: ${getMaxHeight};
`;

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  min-width: ${math.multiply(gridSize, 20)}px;
  padding: ${math.multiply(gridSize, 2.5)}px;
`;
