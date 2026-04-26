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

export default function EditProductScreen({ navigation, route }) {
  const { product } = route.params;

  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price));
  const [unit, setUnit] = useState(product.unit);
  const [quantity, setQuantity] = useState(String(product.quantity));
  const [existingPhotos, setExistingPhotos] = useState(
    product.photo_urls || [],
  );
  const [newPhotos, setNewPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [showCategories, setShowCategories] = useState(false);
  const [showUnits, setShowUnits] = useState(false);

  const pickPhoto = async () => {
    if (existingPhotos.length + newPhotos.length >= 3) {
      Alert.alert("Limit reached", "You can have maximum 3 photos");
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setNewPhotos((prev) => [...prev, result.assets[0]]);
      }
    } catch (error) {
      Alert.alert("Error", "Could not open photo library");
    }
  };

  const removeExistingPhoto = (index) => {
    const { t } = useTranslation();
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewPhoto = (index) => {
    const { t } = useTranslation();
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const { t } = useTranslation();
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

      existingPhotos.forEach((url) => {
        formData.append("existing_photos", url);
      });

      newPhotos.forEach((photo, index) => {
        const filename = photo.uri.split("/").pop();
        const extension = filename.split(".").pop();
        formData.append("photos", {
          uri: photo.uri,
          name: `photo_${index}.${extension}`,
          type: `image/${extension}`,
        });
      });

      await productsAPI.update(product.id, formData);

      Alert.alert(t("common.ok"), t("addProduct.successEdit"), [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Failed to update product";
      Alert.alert(t("common.error"), message);
    } finally {
      setLoading(false);
    }
  };

  const totalPhotos = existingPhotos.length + newPhotos.length;

  return (
    <View className="flex-1 bg-light">
      <View className="bg-white px-6 pt-14 pb-4 flex-row items-center gap-x-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-primary text-base font-bold">
            {t("common.back")}
          </Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-dark">
          {t("addProduct.editTitle")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6">
          <Text className="text-dark font-bold text-base mb-3">
            {t("addProduct.photos")}
            <Text className="text-muted font-normal"> ({totalPhotos}/3)</Text>
          </Text>
          <View className="flex-row gap-x-3 flex-wrap">
            {existingPhotos.map((url, index) => (
              <View key={`existing-${index}`} className="relative mb-3">
                <Image
                  source={{ uri: url }}
                  className="w-24 h-24 rounded-xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                  onPress={() => removeExistingPhoto(index)}
                >
                  <Text className="text-white text-xs font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {newPhotos.map((photo, index) => (
              <View key={`new-${index}`} className="relative mb-3">
                <Image
                  source={{ uri: photo.uri }}
                  className="w-24 h-24 rounded-xl"
                  resizeMode="cover"
                />
                <View className="absolute -top-2 -left-2 bg-secondary rounded-full px-1">
                  <Text className="text-white text-xs font-bold">New</Text>
                </View>
                <TouchableOpacity
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                  onPress={() => removeNewPhoto(index)}
                >
                  <Text className="text-white text-xs font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {totalPhotos < 3 && (
              <TouchableOpacity
                className="w-24 h-24 bg-gray-100 rounded-xl items-center justify-center border-2 border-dashed border-gray-300 mb-3"
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
            Product name <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-dark font-bold mb-2">
            Category <Text className="text-red-500">*</Text>
          </Text>
          <TouchableOpacity
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
            onPress={() => {
              setShowCategories(!showCategories);
              setShowUnits(false);
            }}
          >
            <Text className="text-dark text-base">
              {CATEGORIES.find((c) => c.value === category)?.label || category}
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
                    {cat.label}
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
              Price (€) <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View className="flex-1">
            <Text className="text-dark font-bold mb-2">
              Unit <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
              onPress={() => {
                setShowUnits(!showUnits);
                setShowCategories(false);
              }}
            >
              <Text className="text-dark text-base">{unit}</Text>
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
                    <Text className="text-base text-dark">
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
            Quantity <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
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
              {t("addProduct.saveChanges")}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
