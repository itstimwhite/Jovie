declare module 'qrcode-svg' {
  interface QRCodeOptions {
    content: string;
    width?: number;
    height?: number;
    padding?: number;
    color?: string;
    background?: string;
    ecl?: 'L' | 'M' | 'Q' | 'H';
    join?: boolean;
    predefined?: boolean;
    xmlDeclaration?: boolean;
    container?: string;
  }

  class QRCode {
    constructor(options: QRCodeOptions | string);
    svg(): string;
    save(file: string, callback?: (error: Error | null) => void): void;
  }

  export = QRCode;
}
