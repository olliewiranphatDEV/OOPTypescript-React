import React from "react";

const MainNavBar: React.FC = () => {
    return (
        <nav
            style={{
                padding: "12px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
            }}
        >
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                📚 Library App
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
                <button>Home</button>
                <button>Sign In</button>
                <button>Register</button>
            </div>
        </nav>
    );
};

export default MainNavBar;
