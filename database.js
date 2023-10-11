import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql("drop table if exists menuitems;");
        });
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "create table if not exists menuitems (title text primary key not null, description text, price text, category text, image text);"
                );
            },
            reject,
            resolve
        );
    });
}

export async function getMenuItems() {
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql("select * from menuitems", [], (_, { rows }) => {
                resolve(rows._array);
            });
        });
    });
}

export function saveMenuItems(menuItems) {
    db.transaction((tx) => {
        menuItems.forEach((item) => {
            const { name, description, price, category, image } = item;
            const query =
                "insert into menuitems (title, description, price, category, image) VALUES (?, ?, ?, ?, ?)";
            tx.executeSql(
                query,
                [name, description, price, category, image],
                (_, { insertId }) => {
                    console.log("Inserted row ID: ", insertId);
                },
                (err) => {
                    console.log("Failed: " + err);
                }
            );
        });
    });
}

export async function filterByQueryAndCategories(query, activeCategories) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            const result = [];
            let placeholder = "?";

            activeCategories.forEach((item) => {
                placeholder += ", ?";
            });

            tx.executeSql(
                `select * from menuitems where category in ( ${placeholder})`,
                [...activeCategories],
                (_, { rows }) => {
                    rows._array.forEach((item) => {
                        if (
                            item.title
                                .toLowerCase()
                                .includes(query.toLowerCase())
                        ) {
                            result.push(item);
                        }
                    });
                    resolve(result);
                }
            );
        });
    });
}
