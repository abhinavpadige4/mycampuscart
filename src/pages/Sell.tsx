import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ArrowLeft, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Sell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Books",
    "Electronics", 
    "Furniture",
    "Accessories",
    "Clothing",
    "Sports & Recreation",
    "Miscellaneous"
  ];

  const conditions = [
    "Brand New",
    "Like New", 
    "Good",
    "Fair",
    "Poor"
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call - replace with actual Supabase integration
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Item Listed Successfully!",
        description: `${formData.title} has been posted to the marketplace.`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to list item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userName="John Student" />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            Sell Your <span className="hero-text">Item</span>
          </h1>
          <p className="text-muted-foreground">
            List your item for sale to other students on campus
          </p>
        </div>

        <Card className="marketplace-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
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
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Calculus Textbook - 3rd Edition"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="25.00"
                      className="pl-10"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
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
                  <Label htmlFor="condition">Condition *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition.toLowerCase()}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
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
                          setFormData({ ...formData, image: null });
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
                  onClick={() => navigate('/dashboard')}
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
      </div>
    </div>
  );
};