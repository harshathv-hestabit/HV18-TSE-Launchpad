import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        brand: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        colors: { type: [String], required: false, trim: true },
        price: { type: Number, required: true, min: 0 },
        tags: { type: [String], required: true, trim: true },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' }
    },
    { timestamps: true }
);

productSchema.pre('save', function (next) {
    if (this.name) this.name = this.name.trim();
    next();
});

productSchema.index({ status: 1, createdAt: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
