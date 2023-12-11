import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import BaseContainer from './base-contaner';
import Button from './button';

const DropdownMenu = styled(BaseContainer)`
  display: block;
  position: absolute;
  width: auto;
  height: auto;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.secondary};
  z-index: 1;
`;

interface DropdownItem {
    label: string;
}

const DropdownItem = styled.div<DropdownItem>`
  padding: 0.6em 1.2em;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.primary};
  }
`;

interface DropdownButtonProps {
    items: DropdownItem[];
    onSelectItem: (item: DropdownItem) => void;
    children: React.ReactNode;
}

const DropdownButton = ({ items, onSelectItem, children }: DropdownButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const toggleDropdown = () => {
        if (buttonRef.current) {
            // Get the button position
            const buttonRect = buttonRef.current.getBoundingClientRect();

            // ... and then set the menu position to the bottom of the button.
            // Is this somewhat goofy? Yeah, but it works quite well honestly.
            setMenuPosition({
                top: buttonRect.bottom + window.scrollY,
                left: buttonRect.left + window.scrollX
            });
        }
        setIsOpen(!isOpen);
    };

    const handleItemSelect = (item: DropdownItem) => {
        onSelectItem(item);
        setIsOpen(false);
    };

    // If the user clicks outside of the dropdown, close it
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target) && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }

        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [buttonRef, dropdownRef]);

    return (
        <>
            <Button ref={buttonRef} onClick={() => toggleDropdown()}>
                {children}
            </Button>
            {
                isOpen &&
                <DropdownMenu style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }} ref={dropdownRef}>
                    {items.map((item, index) => (
                        <DropdownItem key={index} onClick={() => handleItemSelect(item)}>
                            {item.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            }
        </>
    );
};

export default DropdownButton;
