import { Destructible } from '@visue/core/DestructibleBase';
import { Identifiable, IdentifiableConfig } from '@visue/utils';
import { SetOptions } from '../types';

/**
 * コンフィグ
 */
export type MessageNotifierConfig = IdentifiableConfig & SetOptions;

/**
 * メッセージを表示するインターフェイス
 */
export interface MessageNotifier<O extends SetOptions = SetOptions> extends Identifiable, Destructible {
  /**
   * メッセージを設定する
   * @param message
   * @param options
   */
  set(message: string, options?: O): void;
}
