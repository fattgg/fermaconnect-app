import { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { farmersAPI } from "../../services/api";
import { MUNICIPALITY_COORDS, KOSOVO_REGION } from "../../constants";
import { useTranslation } from "react-i18next";

export default function MapScreen({ navigation }) {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const res = await farmersAPI.getForMap();
      const farmers = res.data.farmers;

      const byMunicipality = {};
      farmers.forEach((f) => {
        const coords = MUNICIPALITY_COORDS[f.municipality];
        if (!coords) return;
        if (!byMunicipality[f.municipality]) {
          byMunicipality[f.municipality] = {
            municipality: f.municipality,
            coords,
            farmers: [],
          };
        }
        byMunicipality[f.municipality].farmers.push(f);
      });

      setGroups(Object.values(byMunicipality));
    } catch (error) {
      console.error("Failed to fetch map farmers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light">
      <View className="bg-white px-6 pt-14 pb-4">
        <Text className="text-2xl font-bold text-dark">{t("map.title")}</Text>
        <Text className="text-muted text-sm mt-1">
          {t("map.subtitle", { count: groups.length })}
        </Text>
      </View>

      <MapView style={{ flex: 1 }} initialRegion={KOSOVO_REGION}>
        {groups.map((g) => (
          <Marker
            key={g.municipality}
            coordinate={{
              latitude: g.coords.lat,
              longitude: g.coords.lon,
            }}
            title={g.municipality}
            description={t("map.farmerCount", { count: g.farmers.length })}
            pinColor="#2D6A4F"
            onPress={() => setSelected(g)}
          />
        ))}
      </MapView>

      {selected && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
          style={{ maxHeight: 320, elevation: 8 }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-dark font-bold text-lg">
              {selected.municipality}
            </Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text className="text-muted text-base">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {selected.farmers.map((f) => (
              <TouchableOpacity
                key={f.id}
                className="border-b border-gray-100 py-3"
                onPress={() => {
                  setSelected(null);
                  navigation.navigate("FarmerProfile", { farmerId: f.id });
                }}
              >
                <Text className="text-dark font-bold text-base">{f.name}</Text>
                <Text className="text-muted text-xs mt-1">
                  {t("map.availableProducts", { count: f.available_products })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
