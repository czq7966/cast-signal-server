import * as Receiver from '../../../app/src/windows/receiver'
import { IBaseWindowClass } from '../../../app/src/windows/base-window'


var AppWindows: {[name: string] : IBaseWindowClass} = {
    "Receiver-BGWindow": Receiver.BGWindow,
    "Receiver-FloatWindow": Receiver.FloatWindow,
    "Receiver-SendersWindow": Receiver.SendersWindow,
}

export { AppWindows }