import cuid from '@paralleldrive/cuid2';
import { UserGender } from '@/modules/user/domain/enums';

export class CustomerProfile {
  private constructor(
    public readonly id: string,
    private userId: string,
    private name: string | null,
    private dob: Date | null,
    private gender: UserGender | null,
    private profilePicture: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new customer profiles
  static create(
    userId: string,
    name: string | null = null,
    dob: Date | null = null,
    gender: UserGender | null = null,
  ): CustomerProfile {
    return new CustomerProfile(
      cuid.createId(),
      userId,
      name,
      dob,
      gender,
      null, // profilePicture
      new Date(),
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    userId: string,
    name: string | null,
    dob: Date | null,
    gender: UserGender | null,
    profilePicture: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): CustomerProfile {
    return new CustomerProfile(
      id,
      userId,
      name,
      dob,
      gender,
      profilePicture,
      createdAt,
      updatedAt,
    );
  }

  // Business methods
  updateName(newName: string | null): void {
    this.name = newName;
  }

  updateDob(newDob: Date | null): void {
    if (newDob && newDob > new Date()) {
      throw new Error('Date of birth cannot be in the future');
    }
    this.dob = newDob;
  }

  updateGender(newGender: UserGender | null): void {
    this.gender = newGender;
  }

  updateProfilePicture(newProfilePicture: string | null): void {
    this.profilePicture = newProfilePicture;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getName(): string | null {
    return this.name;
  }

  getDob(): Date | null {
    return this.dob;
  }

  getGender(): UserGender | null {
    return this.gender;
  }

  getProfilePicture(): string | null {
    return this.profilePicture;
  }

  getAge(): number | null {
    if (!this.dob) return null;
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}
