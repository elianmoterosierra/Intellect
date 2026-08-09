import { useState } from 'react';
import { COURSE_SECTIONS } from '../utils/courseSections';
import type { SectionKey } from '../utils/courseSections';

export function useCourseNavigation() {
    const [activeSection, setActiveSection] = useState<SectionKey>(COURSE_SECTIONS.DASHBOARD);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSectionChange = (section: SectionKey): void => {
        setIsSearchOpen(false);
        setActiveSection(section);
    };

    return { activeSection, handleSectionChange, isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery };
}