import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import StarRating from "./StarRating";
import { reviewsAPI } from "../../services/api";
import Toast from "react-native-toast-message";

export default function ReviewModal({
  visible,
  onClose,
  orderId,
  onSubmitted,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Toast.show({ type: "error", text1: "Please select a rating" });
      return;
    }

    setSubmitting(true);
    try {
      await reviewsAPI.create({
        order_id: orderId,
        rating,
        comment: comment.trim(),
      });

      Toast.show({ type: "success", text1: "Review submitted" });
      setRating(0);
      setComment("");
      onSubmitted && onSubmitted();
      handleClose();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to submit review";
      Toast.show({ type: "error", text1: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className="flex-1 justify-end bg-black/50">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl p-6">
                <Text className="text-lg font-bold text-dark text-center mb-4">
                  Leave a Review
                </Text>

                <StarRating rating={rating} onRatingChange={setRating} />

                <TextInput
                  className="border border-gray-200 rounded-xl p-3 mt-4 text-dark"
                  placeholder="Share your experience (optional)"
                  multiline
                  numberOfLines={3}
                  value={comment}
                  onChangeText={setComment}
                  returnKeyType="done"
                  blurOnSubmit
                  onSubmitEditing={Keyboard.dismiss}
                />

                <View className="flex-row gap-3 mt-5">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 rounded-xl py-3"
                    onPress={handleClose}
                    disabled={submitting}
                  >
                    <Text className="text-center text-dark font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-primary rounded-xl py-3"
                    onPress={handleSubmit}
                    disabled={submitting}
                  >
                    <Text className="text-center text-white font-semibold">
                      {submitting ? "Submitting..." : "Submit"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
