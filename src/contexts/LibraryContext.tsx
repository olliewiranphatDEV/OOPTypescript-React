import React, { createContext, useContext, useMemo, useState } from "react";
import { LibraryManager } from "../domain/LibraryManager";
import { LocalStorageLibraryStorage } from "../domain/LocalStorageLibraryStorage";
import { Book } from "../domain/Book";
import { Member } from "../domain/Member";

type LibraryContextValue = {
    manager: LibraryManager;
    books: Book[];
    members: Member[];
    refresh: () => void;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [manager] = useState(() => {
        const storage = new LocalStorageLibraryStorage();
        return new LibraryManager(storage);
    });

    // state ที่สะท้อนจาก manager
    const [booksVersion, setBooksVersion] = useState(0);

    const refresh = () => {
        // trick เล็ก ๆ: แค่เปลี่ยน version เพื่อให้ component re-render
        setBooksVersion(v => v + 1);
    };

    const value: LibraryContextValue = useMemo(
        () => ({
            manager,
            books: manager.getBooks(),
            members: manager.getMembers(),
            refresh
        }),
        [manager, booksVersion] // re-calc เมื่อ version เปลี่ยน
    );

    return (
        <LibraryContext.Provider value={value}>
            {children}
        </LibraryContext.Provider>
    );
};

export const useLibrary = (): LibraryContextValue => {
    const ctx = useContext(LibraryContext);
    if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
    return ctx;
};

// เพื่อให้ React เรียกใช้ LibraryManager ง่าย ๆ เราสร้าง Context