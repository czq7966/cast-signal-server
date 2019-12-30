import * as windows from './windows'

var AppWindows: {[name: string] : windows.IBaseWindowClass} = {
    "Receiver-BGWindow": windows.Receiver.BGWindow,
    "Receiver-FloatWindow": windows.Receiver.FloatWindow,
    "Receiver-SendersWindow": windows.Receiver.SendersWindow,
    "Sender-SenderWindow": windows.Sender.SenderWindow
}


export { AppWindows }