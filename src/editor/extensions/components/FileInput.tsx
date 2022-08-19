import * as React from "react";
import cn from "classnames";
import { uploadFile } from "../../utils/file";
import { IFileResult } from "../../types/file";

interface Props {
  onChange: (fileList: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  isHide?: boolean;
}

type State = Pick<IFileResult, "file">;

class FileInput extends React.Component<Props, State> {
  fileRef: React.RefObject<HTMLInputElement> = React.createRef();

  constructor(props: Props) {
    super(props);

    this.state = {
      // @ts-ignore
      file: null
    };
  }

  fileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { multiple, onChange } = this.props;
    const {
      target: { files }
    } = e;
    // @ts-ignore
    const file = files[0];
// @ts-ignore
    if (!files.length) return;
// @ts-ignore
    uploadFile(files, multiple, onChange);
    this.setState({ file });
  };

  render() {
    const { multiple, disabled, isHide } = this.props;

    return (
      <div className={cn({ "is-hide": isHide })}>
        <style
          // @ts-ignore
          jsx>{`
          div.is-hide {
            display: none;
          }
        `}</style>
        <input
          type="file"
          ref={this.fileRef}
          onChange={this.fileOnChange}
          multiple={multiple}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default FileInput;
