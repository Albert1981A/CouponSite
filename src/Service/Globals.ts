class Globals{
}

class DevelopmentGlobals extends Globals{
    public urls = {
        admin: "http://localhost:8080/admin-service/",
        company: "http://localhost:8080/company-service/",
        customer: "http://localhost:8080/customer-service/",
        client:  "http://localhost:8080/client/"
    }
}

class ProductionGlobals extends Globals{
    public urls = {
        admin: "/admin-service/",
        company: "/company-service/",
        customer: "/customer-service/",
        client:  "/client/"
    }
}

// class ProductionGlobals extends Globals{
//     public urls = {
//         admin: "http://localhost:8080/admin-service/",
//         company: "http://localhost:8080/company-service/",
//         customer: "http://localhost:8080/customer-service/",
//         client:  "http://localhost:8080/client/"
//     }
// }

const globals = process.env.NODE_ENV === 'production' ? new ProductionGlobals : new DevelopmentGlobals;

export default globals;