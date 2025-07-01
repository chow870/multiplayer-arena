// src/components/ChatSidebar.tsx
import React, { useState } from "react";
import FriendRequests from "../FriendRequests/FriendRequests";
import SearchUsers from "../SearchUser/SearchUser";
import DisplayFriends from "../MyFriends/displayFriends";
import MainChat from "../Chats/MainChat";

function SideBar() {
  const [activeSection, setActiveSection] = useState<string>("sidebar");

  const goBack = () => setActiveSection("sidebar");

  const renderSection = () => {
    switch (activeSection) {
      case "friends":
        return (
          <Section title="Your Friends" goBack={goBack}>
            <DisplayFriends />
          </Section>
        );
      case "chats":
        return (
          <Section title="Chats" goBack={goBack}>
            <MainChat />
          </Section>
        );
      case "requests":
        return (
          <Section title="Friend Requests" goBack={goBack}>
            <FriendRequests />
          </Section>
        );
      case "search":
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
    <aside
      className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700"
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎮</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">GameZone</h1>
              <p className="text-slate-400 text-sm">Social Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {[
              {
                id: "friends",
                label: "Friends",
                icon: "👥",
                desc: "Manage friends",
              },
              {
                id: "chats",
                label: "Messages",
                icon: "💬",
                desc: "Chat conversations",
              },
              {
                id: "requests",
                label: "Requests",
                icon: "📨",
                desc: "Friend requests",
              },
              {
                id: "search",
                label: "Discover",
                icon: "🔍",
                desc: "Find new people",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="w-full group relative flex items-center gap-4 p-4 text-left rounded-xl transition-all duration-200 hover:bg-slate-700/50 border border-transparent hover:border-slate-600"
              >
                <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium group-hover:text-blue-300 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-slate-400 text-sm truncate">{item.desc}</p>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-300 text-sm font-medium">Quick Access</p>
            <p className="text-slate-500 text-xs mt-1">
              Navigate through your social features
            </p>
          </div>
        </div>
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
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col">
      {/* Section Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="flex items-center justify-center w-10 h-10 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors group"
          >
            <span className="text-slate-300 group-hover:text-white transition-colors">
              ←
            </span>
          </button>
          <div>
            <h2 className="text-white font-bold text-lg">{title}</h2>
            <p className="text-slate-400 text-sm">Navigate your connections</p>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

export default SideBar;
