import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StarRating({
  rating,
  onRatingChange,
  size = 36,
  readonly = false,
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View className="flex-row justify-center gap-2">
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          disabled={readonly}
          onPress={() => onRatingChange && onRatingChange(star)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color={star <= rating ? "#F4A261" : "#6C757D"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
