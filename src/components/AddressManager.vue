
<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { post } from 'aws-amplify/api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

// State
const addresses = ref([...props.modelValue || []]);
const showAddressForm = ref(false);
const newAddress = ref({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: ''
});
const isSubmitting = ref(false);

// Toggle form visibility
function toggleAddressForm() {
  showAddressForm.value = !showAddressForm.value;
  
  // Reset form if closing
  if (!showAddressForm.value) {
    newAddress.value = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
  }
}

// Save a new address
async function saveAddress() {
  if (!newAddress.value.street || !newAddress.value.city || !newAddress.value.zipCode) {
    toast.error('Please fill in the required fields');
    return;
  }

  isSubmitting.value = true;

  try {
    // Create address object to send to API
    const addressData = {
      address: newAddress.value.street,
      city: newAddress.value.city,
      state: newAddress.value.state,
      postal_code: newAddress.value.zipCode,
      country: newAddress.value.country
    };

    // Save to API
    const response = await post({
      apiName: 'address',
      path: '/address',
      options: {
        body: addressData
      }
    });

    console.log('Address added successfully:', response);

    // Add to local state with generated ID from response or fallback to timestamp
  
    const savedAddress = {
    // @ts-ignore
      id: response?.address?.id || Date.now().toString(),
      street: newAddress.value.street,
      city: newAddress.value.city,
      state: newAddress.value.state,
      zipCode: newAddress.value.zipCode,
      country: newAddress.value.country
    };

    addresses.value.push(savedAddress);
    emit('update:modelValue', [...addresses.value]);
    
    // Reset form and hide it
    newAddress.value = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    showAddressForm.value = false;
    
    toast.success('Address added successfully');
  } catch (error) {
    console.error('Error adding address:', error);
    toast.error('Failed to add address');
  } finally {
    isSubmitting.value = false;
  }
}

</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium">Your Addresses</h3>
      <Button 
        variant="outline" 
        size="sm" 
        class="flex items-center gap-1" 
        @click="toggleAddressForm"
        v-if="!showAddressForm"
      >
        <PlusCircle class="w-4 h-4 mr-1" />
        <span>Add Address</span>
      </Button>
    </div>

    <!-- Empty state when no addresses -->
    <div v-if="addresses.length === 0 && !showAddressForm" class="text-center p-6 border border-dashed rounded-lg bg-muted/20">
      <p class="text-muted-foreground">No addresses added yet</p>
      <Button variant="outline" size="sm" class="mt-2" @click="toggleAddressForm">
        <PlusCircle class="w-4 h-4 mr-2" />
        Add Your First Address
      </Button>
    </div>
    
    <!-- New address form -->
    <Card v-if="showAddressForm" class="mb-4 border-2 border-primary/20">
      <CardHeader class="flex flex-row items-center justify-between py-3">
        <CardTitle class="text-base">
          New Address
        </CardTitle>
      </CardHeader>
      <CardContent class="py-2">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="street">Street Address <span class="text-red-500">*</span></Label>
            <Input 
              id="street" 
              v-model="newAddress.street" 
              placeholder="123 Main St" 
              :disabled="isSubmitting"
            />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="city">City <span class="text-red-500">*</span></Label>
              <Input 
                id="city" 
                v-model="newAddress.city" 
                placeholder="City"
                :disabled="isSubmitting" 
              />
            </div>
            
            <div class="space-y-2">
              <Label for="state">State/Province</Label>
              <Input 
                id="state" 
                v-model="newAddress.state" 
                placeholder="State"
                :disabled="isSubmitting" 
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="zipCode">ZIP / Postal Code <span class="text-red-500">*</span></Label>
              <Input 
                id="zipCode" 
                v-model="newAddress.zipCode" 
                placeholder="Postal code"
                :disabled="isSubmitting" 
              />
            </div>
            
            <div class="space-y-2">
              <Label for="country">Country</Label>
              <Input 
                id="country" 
                v-model="newAddress.country" 
                placeholder="Country"
                :disabled="isSubmitting" 
              />
            </div>
          </div>
          
          <div class="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              @click="toggleAddressForm"
              :disabled="isSubmitting"
            >
              Cancel
            </Button>
            <Button 
              @click="saveAddress"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="inline-block animate-spin mr-2">⟳</span>
              {{ isSubmitting ? 'Saving...' : 'Save Address' }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Display existing addresses (read-only) -->
    // @ts-ignore
    <Card v-for="(address, index) in addresses" :key="address.id || index" class="mb-4">
      <CardHeader class="flex flex-row items-center justify-between py-3">
        <CardTitle class="text-base">
          Address {{ index + 1 }}
        </CardTitle>
      </CardHeader>
      <CardContent class="">
        <div class="space-y-2">
          <div class="font-medium">{{ address.address }}</div>
          <div>
            {{ address.city }}{{ address.state ? ', ' + address.state : '' }} 
            {{ address.postal_code }}
          </div>
          <div v-if="address.country">{{ address.country }}</div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>