import { FC } from 'react'
import cn from 'classnames'
import {
  TextField,
  TextFieldProps,
} from '@mui/material'

import './input.styles.scss'
import PasswordInput from './PasswordInput'
import { SvgIconComponent } from "@mui/icons-material"

interface InputCustomProps {
  icon?: SvgIconComponent 
}

const Input: FC<TextFieldProps & InputCustomProps> = ({
  type,
  icon: Icon,
  error,
  fullWidth,
  ...rest
}) => {
  return (
    <div
      className={cn('text-field', {
        'text-field__password': type === 'password',
        'text-field__error': error,
        'text-field__full-width': fullWidth,
        'text-field__icon': Icon,
      })}>
      {Icon && <div className="text-field__icon-wrapper">{<Icon />}</div>}

      {type === 'password' ? (
        <PasswordInput error={error} {...rest} fullWidth={fullWidth} />
      ) : (
        <TextField type={type} variant="outlined" fullWidth={fullWidth} {...rest} />
      )}
    </div>
  )
}

export default Input