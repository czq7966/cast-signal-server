import * as Sender from '../../../app/src/windows/sender'
import { IBaseWindowClass } from '../../../app/src/windows/base-window'


var AppWindows: {[name: string] : IBaseWindowClass} = {
    "Sender-SenderWindow": Sender.SenderWindow,
}

export { AppWindows }