
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, IndianRupee, AlertCircle } from "lucide-react";
import { CreateProductData } from "@/types/product";
import { productSchema, sanitizeInput, validatePhoneNumber, validateImageUrl } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

interface SellFormProps {
  categories: readonly string[];
  locations: readonly string[];
  onSubmit: (data: CreateProductData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const SellForm = ({ categories, locations, onSubmit, onCancel, isSubmitting }: SellFormProps) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    price: 0,
    description: "",
    category: "",
    whatsapp_number: "",
    location: "",
    image: ""
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Enhanced file validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or WebP image",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
        setErrors({ ...errors, image: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    
    try {
      switch (field) {
        case 'name':
          productSchema.shape.name.parse(sanitizeInput(value));
          delete newErrors.name;
          break;
        case 'price':
          productSchema.shape.price.parse(Number(value));
          delete newErrors.price;
          break;
        case 'description':
          productSchema.shape.description.parse(sanitizeInput(value));
          delete newErrors.description;
          break;
        case 'whatsapp_number':
          if (!validatePhoneNumber(value)) {
            newErrors.whatsapp_number = "Invalid phone number format";
          } else {
            delete newErrors.whatsapp_number;
          }
          break;
        case 'image':
          if (value && !validateImageUrl(value)) {
            newErrors.image = "Invalid or unsafe image URL";
          } else {
            delete newErrors.image;
          }
          break;
      }
    } catch (error: any) {
      newErrors[field] = error.errors?.[0]?.message || "Invalid input";
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: any) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    setFormData({ ...formData, [field]: sanitizedValue });
    validateField(field, sanitizedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation before submission
    try {
      const validatedData = productSchema.parse({
        ...formData,
        name: sanitizeInput(formData.name),
        description: sanitizeInput(formData.description)
      }) as CreateProductData;
      
      // Additional security checks
      if (formData.whatsapp_number && !validatePhoneNumber(formData.whatsapp_number)) {
        throw new Error("Invalid WhatsApp number");
      }
      
      if (formData.image && !validateImageUrl(formData.image)) {
        throw new Error("Invalid or unsafe image URL");
      }
      
      onSubmit(validatedData);
    } catch (error: any) {
      toast({
        title: "Validation Error",
        description: error.errors?.[0]?.message || error.message || "Please check your input",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="marketplace-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <IndianRupee className="h-5 w-5 mr-2 text-primary" />
          Item Details
        </CardTitle>
        <CardDescription>
          Fill out the information below to list your item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Calculus Textbook - 3rd Edition"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  placeholder="2500"
                  className={`pl-10 ${errors.price ? "border-destructive" : ""}`}
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                />
              </div>
               {errors.price && (
                 <p className="text-sm text-destructive flex items-center">
                   <AlertCircle className="h-4 w-4 mr-1" />
                   {errors.price}
                 </p>
               )}
             </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input
                id="whatsapp"
                placeholder="+91XXXXXXXXX"
                value={formData.whatsapp_number}
                onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                className={errors.whatsapp_number ? "border-destructive" : ""}
                required
              />
              {errors.whatsapp_number && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.whatsapp_number}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your item in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? "border-destructive" : ""}
              rows={4}
              required
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Item Photo</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-xs mx-auto rounded-lg"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setImagePreview("");
                      setFormData({ ...formData, image: "" });
                    }}
                  >
                    Change Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <Label htmlFor="image" className="cursor-pointer">
                      <span className="text-primary hover:text-primary/80">Click to upload</span>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="gradient" 
              disabled={isSubmitting}
              className="sm:flex-1"
            >
              {isSubmitting ? "Listing Item..." : "List Item"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
