import { TbBrandProducthunt, TbUsersGroup } from "react-icons/tb";

export type Route = {
    title: string;
    description: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    path: string;
};


export type RouteGroup = {
    [K: string]: Route[] | RouteGroup | undefined;
    items?: Route[];
} & Partial<{
    [K in string]: Route[] | RouteGroup;
    
}>;


export const admin_routes: RouteGroup = {
    dashboard: {
        items: [
            {
                title: "Products",
                description: "Manage your products",
                Icon: TbBrandProducthunt,
                path: "dashboard/admin/products",
            },
            {
                title: "Users",
                description: "Manage your users",
                Icon: TbUsersGroup,
                path: "dashboard/admin/users",
            },
        ],
        products: {
            items: [
                {
                    title: "Import Products",
                    description: "Bulk import your products",
                    Icon: TbBrandProducthunt,
                    path: "dashboard/admin/products/import",
                },
                {
                    title: "Add Product",
                    description: "Manually add a new product",
                    Icon: TbBrandProducthunt,
                    path: "dashboard/admin/products/add",
                },
                {
                    title: "Product Stats",
                    description: "View product analytics",
                    Icon: TbBrandProducthunt,
                    path: "dashboard/admin/products/stats",
                },
            ],
        },
        users: {
            items: [
                {
                    title: "Add User",
                    description: "Create a new user",
                    Icon: TbUsersGroup,
                    path: "dashboard/admin/users/add",
                },
                {
                    title: "Update User",
                    description: "Edit user details",
                    Icon: TbUsersGroup,
                    path: "dashboard/admin/users/update",
                },
            ],
        },
        orders: {
            items: [
                {
                    title: "All Orders",
                    description: "View all orders",
                    Icon: TbBrandProducthunt,
                    path: "dashboard/admin/orders",
                },
            ],
            details: {
                items: [
                    {
                        title: "Order Details",
                        description: "View order details",
                        Icon: TbBrandProducthunt,
                        path: "dashboard/admin/orders/details",
                    },
                ],
            },
        },
        settings: {
            items: [], // Empty but still valid
        },
    },
};
