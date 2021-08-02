class CouponsModel {
    public id ? : number;
    public companyID ? : number;
    public category ? : string;
    public title ? : string;
    public description ? : string;
    public startDate ? : Date;
    public endDate ? : Date;
    public amount ? : number;
    public price ? : number;
    public image ? : string; //=> FileList;
}

export default CouponsModel;

//     private int id;
//     private int companyID;
//     private Category category;
//     private String title;
//     private String description;
//     private Date startDate;
//     private Date endDate;
//     private int amount;
//     private double price;
//     private String image;