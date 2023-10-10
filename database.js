import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
    return new Promise((resolve, reject) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "create table if not exists menuitems (id integer primary key not null, title text, description text, price text, category text);"
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
            const query =
                "insert into menuitems (id, title, description, price, category) VALUES (?, ?, ?, ?, ?)";
            tx.executeSql(
                query,
                [
                    item?.id,
                    item?.title,
                    item?.description,
                    item?.price,
                    item?.category?.title,
                ],
                (_, { rows }) => {
                    console.log("Success");
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
