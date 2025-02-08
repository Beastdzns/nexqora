"use client";
import { useState } from "react";
import SponsorTab from "@/components/tabs/SponsorTab";
import SearchTab from "@/components/tabs/SearchTab";
import NewPostTab from "@/components/tabs/NewPostTab";
import ReceivedTab from "@/components/tabs/ReceivedTab";
import ProfileTab from "@/components/tabs/ProfileTab";

const TabBar = () => {
  const [activeTab, setActiveTab] = useState(3);

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return <SponsorTab setActiveTab={setActiveTab} />;
      case 2:
        return <SearchTab />;
      case 3:
        return <NewPostTab />;
      case 4:
        return <ReceivedTab />;
      case 5:
        return <ProfileTab />;
      default:
        return <NewPostTab />;
    }
  };

  const getTabStyle = (tabNumber: any) => {
    const baseStyle = "p-2 rounded-lg transition-all duration-200 ease-in-out";
    return activeTab === tabNumber
      ? `${baseStyle} bg-blue-100 scale-110 text-blue-600`
      : `${baseStyle} hover:bg-gray-100`;
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="flex-grow">{renderContent()}</div>
      <div className="flex justify-around items-center bg-white p-2.5 border-t border-gray-200 bottom-0 fixed w-full">
        <button
          onClick={() => setActiveTab(1)}
          className={getTabStyle(1)}
          aria-label="Home"
        >
          <span className="text-2xl">🏠</span>
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={getTabStyle(2)}
          aria-label="Search"
        >
          <span className="text-2xl">🔍</span>
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={getTabStyle(3)}
          aria-label="New Post"
        >
          <span className="text-2xl">➕</span>
        </button>
        <button
          onClick={() => setActiveTab(4)}
          className={getTabStyle(4)}
          aria-label="Received"
        >
          <span className="text-2xl">❤️</span>
        </button>
        <button
          onClick={() => setActiveTab(5)}
          className={getTabStyle(5)}
          aria-label="Profile"
        >
          <span className="text-2xl">👤</span>
        </button>
      </div>
    </div>
  );
};

export default TabBar;
