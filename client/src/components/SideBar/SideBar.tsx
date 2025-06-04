// src/components/ChatSidebar.tsx
import React, { useState } from 'react';
import FriendRequests from '../FriendRequests/FriendRequests';
import SearchUsers from '../SearchUser/SearchUser';
import DisplayFriends from '../MyFriends/displayFriends';
import MainChat from '../Chats/MainChat';


function SideBar() {
    const [activeSection, setActiveSection] = useState<string>('sidebar');

    const goBack = () => setActiveSection('sidebar');

    const renderSection = () => {
        switch (activeSection) {
            case 'friends':
                return (
                    <Section title="Your Friends" goBack={goBack}>
                        <p className="text-gray-600 dark:text-gray-300">Friends list goes here...</p>
                        <DisplayFriends/>
                    </Section>
                );
            case 'chats':
                return (
                    <Section title="Chats" goBack={goBack}>
                        <p className="text-gray-600 dark:text-gray-300">Chat conversations go here...</p>
                        <MainChat/>
                    </Section>
                );
            case 'requests':
                return (
                    <Section title="Friend Requests" goBack={goBack}>
                        <FriendRequests />
                    </Section>
                );
            case 'search':
                return (
                    <Section title="Search People" goBack={goBack}>
                        <SearchUsers />
                    </Section>
                );
            default:
                return renderSidebar();
        }
    };

    const renderSidebar = () => (
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-all bg-gray-50 dark:bg-gray-800" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto">
                <div className="flex items-center ps-2.5 mb-5">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 me-3 sm:h-7" alt="Logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">🎮 GameZone</span>
                </div>
                <ul className="space-y-2 font-medium">
                    <li>
                        <button onClick={() => setActiveSection('friends')} className="w-full text-left flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="ms-3">Your Friends</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection('chats')} className="w-full text-left flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="ms-3">Chats</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection('requests')} className="w-full text-left flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="ms-3">Friend Requests</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection('search')} className="w-full text-left flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="ms-3">Search People</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );

    return <>{renderSection()}</>;
}

function Section({
    title,
    goBack,
    children,
}: {
    title: string;
    goBack: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="p-4 ml-64 transition-all">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={goBack} className="p-2 text-white bg-gray-600 rounded hover:bg-gray-500">
                    ← Back
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
            </div>
            {children}
        </div>
    );
}

export default SideBar;
