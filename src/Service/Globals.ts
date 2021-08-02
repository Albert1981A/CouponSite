class Globals{
}

class DevelopmentGlobals extends Globals{
    public urls = {
        admin: "http://localhost:8080/admin-service/",
        company: "http://localhost:8080/company-service/",
        customer: "http://localhost:8080/customer-service/"

        // cats: "http://localhost:8080/api/cats/"
        // kittens: "https://raw.githubusercontent.com/KobiShashs/Caas-Resources/master/cats.json"
        // image: "http://localhost:8080/api/cats/images/"
    }
}

class ProductionGlobals extends Globals{
    public urls = {
        admin: "http://localhost:8080/admin-service/",
        company: "http://localhost:8080/company-service/",
        customer: "http://localhost:8080/customer-service/"

        // cats: "http://localhost:8080/api/cats/"
        // image: "http://localhost:8080/api/cats/images/"
    }
}

const globals = process.env.NODE_ENV === 'production' ? new ProductionGlobals : new DevelopmentGlobals;

export default globals;