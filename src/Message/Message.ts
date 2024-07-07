import DestructibleBase from '@visue/core/base/DestructibleBase';
import { t } from '@visue/i18n';
import asArray from '@visue/utils/array/asArray';
import pushUnique from '@visue/utils/array/pushUnique';
import isString from 'lodash/isString';
import remove from 'lodash/remove';
import { MESSAGE_LEVEL, MESSAGE_LEVEL_ORDER, MESSAGE_TYPE } from '../constants';
import MessageNotifierFactory from '../notifier/MessageNotifierFactory';
import { MessageNotifier, MessageNotifierConfig } from '../notifier/types';
import { MessageLevel } from '../types';
import { MessageConfig, MessageSetOptions, RegisterOptions } from './types';

/**
 * メッセージ
 */
class Message<C extends MessageConfig = MessageConfig> extends DestructibleBase<C> {
  /**
   * 配信先
   */
  private _notifiers: { [type: string]: MessageNotifier[] } = {};

  /**
   * 出力するメッセージレベル
   */
  private _level: MessageLevel = MESSAGE_LEVEL.INFO;

  /**
   * 出力するメッセージレベルを変更
   * @param level
   */
  setLevel(level: MessageLevel): void {
    this._level = level;
  }

  /**
   * notifierを登録する
   * @param notifier
   */
  register(notifier: string | MessageNotifierConfig | MessageNotifier, options: RegisterOptions = {}) {
    const { types = MESSAGE_TYPE.GLOBAL } = options;
    for (const type of asArray(types)) {
      const notifiers = this._notifiers[type] || [];
      notifiers.push(MessageNotifierFactory.get(notifier));
      this._notifiers[type] = notifiers;
    }
  }

  /**
   * notifierを削除する
   * @param target id or notifierのインスタンス
   * @returns
   */
  remove(target: string | MessageNotifier): MessageNotifier[] {
    let predicate;
    if (isString(target)) {
      predicate = (notifier: MessageNotifier) => notifier.$id === target;
    } else {
      predicate = (notifier: MessageNotifier) => notifier === target;
    }
    const removed = [];
    for (const type in this._notifiers) {
      const notifiers = this._notifiers[type];
      pushUnique(removed, remove(notifiers, predicate));
    }
    return removed;
  }

  /**
   * メッセージを設定する
   * @param arg1 メッセージまたはメッセージオプション
   * @param arg2 メッセージオプション
   */
  set(arg1: string | MessageSetOptions, arg2?: MessageSetOptions): void {
    let message, options;
    if (isString(arg1)) {
      message = arg1;
      options = arg2 || {};
    } else {
      const { message: msg, ...rest } = arg1;
      message = msg;
      options = rest;
    }

    const { type = MESSAGE_TYPE.GLOBAL, level = MESSAGE_LEVEL.INFO, params, ...rest } = options,
      notifiers = this._notifiers[type];

    if (notifiers && MESSAGE_LEVEL_ORDER[this._level] <= MESSAGE_LEVEL_ORDER[level]) {
      // 現在のレベル以上のレベルのみ出力
      const msg = t(message, { params }),
        opts = { type, level, ...rest };
      // 登録されているnotifierにメッセージを渡す
      notifiers.forEach((notifier) => notifier.set(msg, opts));
    }
  }

  destructor(): void {
    this._deleteProperties(['_notifiers']);
    super.destructor();
  }
}
export default new Message();
