import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Search from "@/components/Search";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import icons from "@/constants/icons";
import NoResults from "@/components/NoResults";
import { baseUrl } from "@/config/Index";

type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber?: number;
  whatsappNumber?: number;
  city?: string;
  state?: string;
  pincode?: string;
  image?: string;
  additionalImages?: string[];
  cultivation: string;
};

const CustomerAccount = () => {
  const router = useRouter();
  const { auth } = useAuth();
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [customersFilteredData, setCustomersFilteredData] = useState<
    Customer[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  const getCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/customer/customer-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const CustomerData = await response.json();

      const customerGotData: Customer[] = CustomerData.data;
      setCustomersData(customerGotData);
      setIsLoading(false);
    } catch (error: any) {
      Alert.alert(
        error?.response?.data?.message ||
          error?.message ||
          "Error fetching customer data"
      );
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const Item = ({
    image,
    firstName,
    lastName,
    city,
    cultivation,
  }: Customer) => (
    <View className="bg-white p-4 m-2 rounded-xl flex-row justify-between items-center">
      <View className="flex flex-col gap-2.5">
        <Text className="text-xl font-bold max-370:text-lg">
          {firstName} {lastName}
        </Text>
        <View className="flex flex-row gap-2.5 justify-start items-center">
          <Image source={icons.location} className="w-5 h-6" />
          <Text className="text-sm text-gray-600">{city}</Text>
        </View>
        <View className="flex flex-row gap-2.5 justify-start items-center">
          <Image source={icons.gardener} className="w-5 h-6" />
          <Text className="text-sm text-gray-600">{cultivation}</Text>
        </View>
      </View>
      {image && (
        <Image
          source={{ uri: image }}
          className="w-24 h-24 rounded-full mr-4"
          resizeMode="contain"
        />
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#e9ecef] h-screen w-full">
      <StatusBar backgroundColor="#1b98e0" barStyle="dark-content" />
      <View className="bg-[#e9ecef] h-full w-full">
        <View className="flex flex-row justify-between items-center w-full p-5">
          <Search
            setIsFilter={setIsFilter}
            customersData={customersData}
            setCustomersFilteredData={setCustomersFilteredData}
          />
          <View className="flex flex-row justify-center items-center gap-2.5">
            <Image source={icons.user} className="w-8 h-8" />

            <Text className="text-base font-bold">
              {auth?.name?.split(" ")[0] || auth?.name || "Guest"}
            </Text>
          </View>
        </View>
        <View className="px-5">
          <Text className="my-5 text-2xl font-semibold text-center">
            Customers
          </Text>
          <FlatList
            data={
              customersFilteredData.length > 0
                ? customersFilteredData
                : isFilter
                ? []
                : customersData
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/account/[id]",
                    params: { id: item._id },
                  })
                }
              >
                <Item
                  _id={item._id}
                  image={item.image}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  city={item.city}
                  cultivation={item.cultivation}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{
              paddingBottom: 250,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              isLoading ? (
                <ActivityIndicator
                  size="large"
                  className="text-primary-300 mt-5"
                />
              ) : (
                <NoResults />
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomerAccount;
