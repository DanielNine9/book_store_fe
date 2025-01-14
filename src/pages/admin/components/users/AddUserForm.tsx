import React, { useEffect } from "react";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Button,
} from "@mui/material";

interface AddUserFormProps {
  onSubmit: (data: FormData) => void;
  user?: any; // Optional user prop for editing
}

// Define the schema for form validation using yup
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  role: yup.string().required("Role is required"),
  active: yup.boolean().required("Active status is required"),
});

interface FormData {
  username: string;
  password: string;
  role: string;
  active: boolean;
}

export function AddUserForm({ onSubmit, user }: AddUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // If a user is passed, pre-populate the form fields
  useEffect(() => {
    if (user) {
      console.log("user ", user);
      // Pre-populate the form fields with the user data
      setValue("username", user.username);
      setValue("role", user.role);
      setValue("active", user.active);
      // Do not pre-populate password (as it's usually for editing)
    }
  }, [user, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mx-auto w-fit">
        <div className="rounded-full bg-indigo-100 p-3">
          <UserPlus className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="d-flex" style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <TextField
              label="Username"
              id="username"
              fullWidth
              variant="standard"
              sx={{ flex: 1 }}
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </div>

          <div style={{ flex: 1 }}>
            <FormControl fullWidth error={!!errors.role} variant="standard">
              <InputLabel>Vai trò</InputLabel>
              <Select
                id="role"
                label="Vai trò"
                {...register("role")}
                defaultValue={user?.role || ""} // Ensure the default value is set correctly
              >
                <MenuItem value="staff">Thành viên</MenuItem>
                <MenuItem value="guest">Khách hàng</MenuItem>
                <MenuItem value="admin">Quản trị viên</MenuItem>
              </Select>
              <FormHelperText>{errors.role?.message}</FormHelperText>
            </FormControl>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <TextField
              style={{ flex: 1 }}
              label="Mật khẩu"
              id="password"
              type="password"
              variant="standard"
              fullWidth
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </div>

          <div style={{ flex: 1 }}>
            <FormControl fullWidth error={!!errors.active}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                id="active"
                label="Trạng thái"
                variant="standard"
                {...register("active")}
                defaultValue={user?.active !== undefined ? user.active : true} // Set default for active
              >
                <MenuItem value={"true"}>Hoạt động</MenuItem>
                <MenuItem value={"false"}>Không hoạt động</MenuItem>
              </Select>
              <FormHelperText>{errors.active?.message}</FormHelperText>
            </FormControl>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outlined"
          color="secondary"
          type="button"
          onClick={() => {}} // Replace with your cancel logic
        >
          Hủy
        </Button>
        <Button variant="contained" color="primary" type="submit">
          {user ? "Cập nhật người dùng" : "Thêm người dùng"}
        </Button>
      </div>
    </form>
  );
}
