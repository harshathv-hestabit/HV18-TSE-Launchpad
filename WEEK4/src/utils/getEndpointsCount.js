// function getRoutes(router, basePath = "") {
//     const routes = [];
//     router.stack.forEach(layer => {
//         // If the layer has a route (the actual endpoint)
//         if (layer.route) {
//             const path = basePath + layer.route.path;
//             const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
//             routes.push({ path, methods });
//         }

//         // If the layer is a nested router (mounted via .use)
//         else if (layer.name === "router" && layer.handle.stack) {
//             const newBase = basePath + (layer.regexp?.source === "^\\/?$" ? "" : layer.regexp?.source.replace("\\/?", "").replace("^", "").replace("?$", ""));
//             routes.push(...getRoutes(layer.handle, newBase));
//         }
//     });

//     return routes;
// }

// export default getRoutes;


function extractRoutes(router, parentPath = "") {
    const routes = [];

    router.stack.forEach(layer => {

        // 1. Actual route
        if (layer.route) {
            const path = parentPath + layer.route.path;
            const methods = Object.keys(layer.route.methods)
                .map(m => m.toUpperCase())
                .join(", ");

            routes.push({ path, methods });
        }

        // 2. Mounted router
        else if (layer.name === "router" && layer.handle.stack) {
            let mountPath = "";
            // Express 5 uses matchers instead of regexp
            if (Array.isArray(layer.matchers) && layer.matchers[0]?.path) {
                mountPath = layer.matchers[0].path;        // "/product"
            }

            const fullPath = parentPath + mountPath;

            routes.push(...extractRoutes(layer.handle, fullPath));
        }
    });

    return routes;
}

export default extractRoutes;
