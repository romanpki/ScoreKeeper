import { NativeModules } from 'react-native';

const { ICloudKVS } = NativeModules;

export default {
  async setString(key: string, value: string): Promise<void> {
    if (!ICloudKVS) return;
    ICloudKVS.setString(value, key);
  },

  async getString(key: string): Promise<string | null> {
    if (!ICloudKVS) return null;
    return ICloudKVS.getString(key);
  },

  async removeValue(key: string): Promise<void> {
    if (!ICloudKVS) return;
    ICloudKVS.removeValue(key);
  },

  async synchronize(): Promise<void> {
    if (!ICloudKVS) return;
    await ICloudKVS.synchronize();
  },
};