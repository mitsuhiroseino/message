import DestructibleBase from '@visue/core/base/DestructibleBase';
import assignIdentifier from '@visue/utils/identifier/assignIdentifier';
import { MESSAGE_LEVEL, MESSAGE_LEVEL_ORDER, MESSAGE_TYPE } from '../../constants';
import { MessageLevel } from '../../types';
import { MessageNotifier } from '../types';
import { MessageNotifierConfigBase, SetOptionsBase } from './types';

/**
 *
 */
abstract class MessageNotifierBase<
    O extends SetOptionsBase = SetOptionsBase,
    C extends MessageNotifierConfigBase = MessageNotifierConfigBase,
  >
  extends DestructibleBase<C>
  implements MessageNotifier<O>
{
  readonly isMessageNotifier = true;

  /**
   * ID
   */
  readonly $id!: string;

  /**
   * 識別名
   */
  readonly $idName?: string;

  /**
   * 出力するメッセージレベル
   */
  protected _level: MessageLevel = MESSAGE_LEVEL.INFO;

  constructor(config?: C) {
    super(config);
    assignIdentifier(this, this.config);
  }

  /**
   * 出力するメッセージレベルを変更
   * @param level
   */
  setLevel(level: MessageLevel): void {
    this._level = level;
  }

  set(message: string, options: O = {} as O): void {
    const { type = MESSAGE_TYPE.GLOBAL, level = MESSAGE_LEVEL.INFO } = options;
    if (MESSAGE_LEVEL_ORDER[this._level] <= MESSAGE_LEVEL_ORDER[level]) {
      // 現在のレベル以上のレベルのみ出力
      const opts = { ...options, type, level };
      this._set(message, opts);
    }
  }

  /**
   * 各メッセージ出力処理
   * @param message
   * @param config
   */
  protected abstract _set(message: string, options: O): void;
}
export default MessageNotifierBase;
