"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface SplitTabsProps {
    tabs: {
        id: string;
        label: string;
    }[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}

const SplitTabs = ({ tabs, activeTab, onTabChange, className }: SplitTabsProps) => {
    if (tabs.length !== 2) {
        console.warn('SplitTabs component is designed for exactly 2 tabs');
    }

    return (
        <div className={cn("split-tabs-container", className)}>
            {tabs.map((tab, index) => (
                <div key={tab.id} className="split-tab-section">
                    <div
                        className={`split-tab-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SplitTabs;