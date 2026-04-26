import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { productsAPI } from "../../services/api";
import { CATEGORIES } from "../../constants";
import { useTranslation } from "react-i18next";

const UNITS = ["kg", "piece", "bundle", "litre", "gram", "dozen"];

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCategories, setShowCategories] = useState(false);
  const [showUnits, setShowUnits] = useState(false);
  const { t } = useTranslation();
  const pickPhoto = async () => {
    if (photos.length >= 3) {
      Alert.alert("Limit reached", "You can upload maximum 3 photos");
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos in your device settings",
          [{ text: "OK" }],
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotos((prev) => [...prev, result.assets[0]]);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Could not open photo library");
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !category || !price || !unit || !quantity) {
      Alert.alert(t("common.error"), t("addProduct.fillRequired"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", parseFloat(price) || 0);
      formData.append("unit", unit);
      formData.append("quantity", parseInt(quantity) || 0);

      photos.forEach((photo, index) => {
        const filename = photo.uri.split("/").pop();
        const extension = filename.split(".").pop();
        formData.append("photos", {
          uri: photo.uri,
          name: `photo_${index}.${extension}`,
          type: `image/${extension}`,
        });
      });

      await productsAPI.create(formData);

      Alert.alert(t("common.ok"), t("addProduct.successAdd"), [
        { text: t("common.ok"), onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Failed to create product";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-light">
      <View className="bg-white px-6 pt-14 pb-4 flex-row items-center gap-x-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-primary text-base font-bold">
            {t("common.back")}
          </Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-dark">
          {t("addProduct.title")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6">
          <Text className="text-dark font-bold text-base mb-3">
            {t("addProduct.photos")}
            <Text className="text-muted font-normal">
              {" "}
              {`(${t("common.max")} 3)`}
            </Text>
          </Text>
          <View className="flex-row gap-x-3">
            {photos.map((photo, index) => (
              <View key={index} className="relative">
                <Image
                  source={{ uri: photo.uri }}
                  className="w-24 h-24 rounded-xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                  onPress={() => removePhoto(index)}
                >
                  <Text className="text-white text-xs font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {photos.length < 3 && (
              <TouchableOpacity
                className="w-24 h-24 bg-gray-100 rounded-xl items-center justify-center border-2 border-dashed border-gray-300"
                onPress={pickPhoto}
              >
                <Text className="text-3xl">📷</Text>
                <Text className="text-muted text-xs mt-1">
                  {t("addProduct.addPhoto")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-dark font-bold mb-2">
            {t("addProduct.productName")}{" "}
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
            placeholder={t("addProduct.productNamePlaceholder")}
            placeholderTextColor="#6C757D"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-dark font-bold mb-2">
            {t("addProduct.category")} <Text className="text-red-500">*</Text>
          </Text>
          <TouchableOpacity
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
            onPress={() => {
              setShowCategories(!showCategories);
              setShowUnits(false);
            }}
          >
            <Text
              className={
                category ? "text-dark text-base" : "text-muted text-base"
              }
            >
              {category
                ? t(
                    `categories.${CATEGORIES.find((c) => c.value === category)?.label}`,
                  )
                : t("addProduct.selectCategory")}
            </Text>
            <Text className="text-muted">{showCategories ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          {showCategories && (
            <View className="bg-white border border-gray-200 rounded-xl mt-1">
              {CATEGORIES.filter((c) => c.value !== "").map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  className={`px-4 py-3 border-b border-gray-100 ${
                    category === cat.value ? "bg-primary/10" : ""
                  }`}
                  onPress={() => {
                    setCategory(cat.value);
                    setShowCategories(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      category === cat.value
                        ? "text-primary font-bold"
                        : "text-dark"
                    }`}
                  >
                    {t(`categories.${cat.label}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-dark font-bold mb-2">
            {t("addProduct.description")}
            <Text className="text-muted font-normal">
              {" "}
              {`(${t("common.optional")})`}
            </Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
            placeholder={t("addProduct.descriptionPlaceholder")}
            placeholderTextColor="#6C757D"
            multiline
            numberOfLines={3}
            style={{ textAlignVertical: "top", minHeight: 80 }}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View className="flex-row gap-x-3 mb-4">
          <View className="flex-1">
            <Text className="text-dark font-bold mb-2">
              {t("addProduct.price")} <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
              placeholder="0.00"
              placeholderTextColor="#6C757D"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View className="flex-1">
            <Text className="text-dark font-bold mb-2">
              {t("addProduct.unit")} <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
              onPress={() => {
                setShowUnits(!showUnits);
                setShowCategories(false);
              }}
            >
              <Text>
                {unit ? t(`units.${unit}`) : t("addProduct.selectUnit")}
              </Text>
              <Text className="text-muted">{showUnits ? "▲" : "▼"}</Text>
            </TouchableOpacity>
            {showUnits && (
              <View className="bg-white border border-gray-200 rounded-xl mt-1 absolute top-16 left-0 right-0 z-10">
                {UNITS.map((u) => (
                  <TouchableOpacity
                    key={u}
                    className={`px-4 py-3 border-b border-gray-100 ${
                      unit === u ? "bg-primary/10" : ""
                    }`}
                    onPress={() => {
                      setUnit(u);
                      setShowUnits(false);
                    }}
                  >
                    <Text
                      className={`text-base ${
                        unit === u ? "text-primary font-bold" : "text-dark"
                      }`}
                    >
                      {t(`units.${u}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-dark font-bold mb-2">
            {t("addProduct.quantity")} <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
            placeholder={t("addProduct.quantityPlaceholder")}
            placeholderTextColor="#6C757D"
            keyboardType="number-pad"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>

        <TouchableOpacity
          className="bg-primary rounded-xl py-4 items-center"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              {t("addProduct.listProduct")}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
