/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useCallback, useState, useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { More } from '../../../../components/button';
import DropDownList from '../../../../components/form/dropDown/list';
import Popup from '../../../../components/popup';
import DeleteDialog from './deleteDialog';

const MoreButton = styled(More)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const DropDownContainer = styled.div`
  margin-top: 10px;
`;

/**
 * Get a More icon that displays a dropdown menu on click.
 *
 * @param {Object} props Component props.
 * @param {Object} props.resource Selected media element's resource object.
 * @param {boolean} props.pointerEntered If the user's pointer is in the media element.
 * @param {boolean} props.isMenuOpen If the dropdown menu is open.
 * @param {function(boolean)} props.setIsMenuOpen Callback for when menu is opened / closed.
 * @return {null|*} Element or null if should not display the More icon.
 */
function DropDownMenu({ resource, pointerEntered, isMenuOpen, setIsMenuOpen }) {
  const options = [
    { name: __('Edit', 'web-stories'), value: 'edit' },
    { name: __('Delete', 'web-stories'), value: 'delete' },
  ];

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const moreButtonRef = useRef();

  const onClickMoreIcon = useCallback(() => setIsMenuOpen(true), [
    setIsMenuOpen,
  ]);

  const handleCurrentValue = (value) => {
    setIsMenuOpen(false);
    switch (value) {
      case 'edit':
        // TODO(#354): Edit Media Metadata via Media Library Hover Menu
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
      default:
        break;
    }
  };

  // On menu losing focus.
  const toggleOptions = useCallback(() => setIsMenuOpen(false), [
    setIsMenuOpen,
  ]);

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    !resource.local && ( // Don't show menu if resource not uploaded to server yet.
      <div>
        {(pointerEntered || isMenuOpen) && (
          <>
            <MoreButton
              ref={moreButtonRef}
              width="28"
              height="28"
              onClick={onClickMoreIcon}
              aria-pressed={isMenuOpen}
              aria-haspopup={true}
              aria-expanded={isMenuOpen}
            />
            <Popup anchor={moreButtonRef} isOpen={isMenuOpen}>
              <DropDownContainer>
                <DropDownList
                  handleCurrentValue={handleCurrentValue}
                  options={options}
                  toggleOptions={toggleOptions}
                />
              </DropDownContainer>
            </Popup>
          </>
        )}
        {showDeleteDialog && (
          <DeleteDialog
            mediaId={resource.id}
            showDeleteDialog={showDeleteDialog}
            setShowDeleteDialog={setShowDeleteDialog}
          />
        )}
      </div>
    )
  );
}

DropDownMenu.propTypes = {
  resource: PropTypes.object,
  pointerEntered: PropTypes.bool,
  isMenuOpen: PropTypes.bool,
  setIsMenuOpen: PropTypes.func,
};

export default DropDownMenu;
