import { useRef, useEffect } from "react";

export function getSectionListData(data) {
    const mockMenuData = [];

    data.forEach((section) => {
        found = false;
        mockMenuData.forEach((item) => {
            if (item.title == section.category) {
                item.data = [
                    ...item.data,
                    {
                        title: section.name,
                        price: section.price,
                        description: section.description,
                        image: section.image,
                    },
                ];
                found = true;
            }
        });
        if (!found) {
            mockMenuData.push({
                title: section.category,
                data: [
                    {
                        title: section.name,
                        description: section.description,
                        image: section.image,
                        price: section.price,
                    },
                ],
            });
        }
    });
    return mockMenuData;
}

export function useUpdateEffect(effect, dependencies = []) {
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            return effect();
        }
    }, dependencies);
}