import os
import re

# لیست کامل ۱۱۹ فایلی که باید ویرایش شوند
FILES = [
    "src/app/auth/login/page.jsx",
    "src/app/auth/verify-otp/page.jsx",
    "src/app/business/[id]/map/page.jsx",
    "src/app/create-business/page.jsx",
    "src/app/explore/page.jsx",
    "src/app/line-rentals/[id]/page.jsx",
    "src/app/manage/booking-link/page.jsx",
    "src/app/manage/portfolio/page.jsx",
    "src/app/manage/reminders/page.jsx",
    "src/app/manage/reviews/page.jsx",
    "src/app/manage/schedule/page.jsx",
    "src/app/manage/services/edit/page.jsx",
    "src/app/manage/services/page.jsx",
    "src/app/manage/settings/page.jsx",
    "src/app/model-requests/[id]/page.jsx",
    "src/app/profile/appointments/page.jsx",
    "src/app/profile/change-phone/page.jsx",
    "src/app/profile/devices/page.jsx",
    "src/app/profile/edit/page.jsx",
    "src/app/profile/favorites/page.jsx",
    "src/app/profile/invite/page.jsx",
    "src/app/profile/payments/page.jsx",
    "src/app/profile/support/page.jsx",
    "src/app/search/page.jsx",
    "src/components/home/BusinessMapButton.jsx",
    "src/components/home/search/SearchEmptyState.jsx",
    "src/components/home/search/SearchLineCard.jsx",
    "src/components/home/search/SearchModelCard.jsx",
    "src/components/home/search/SearchTabs.jsx",
    "src/components/booking/BookingModal.jsx",
    "src/components/booking/BookingPaymentBar.jsx",
    "src/components/booking/BookingServiceInfo.jsx",
    "src/components/booking/BookingStepIndicator.jsx",
    "src/components/booking/BookingSummaryBar.jsx",
    "src/components/booking/BookingTimeSelector.jsx",
    "src/components/booking/EmployeeSelector.jsx",
    "src/components/booking/TimeSlotGrid.jsx",
    "src/components/booking/TrustToggle.jsx",
    "src/components/common/ActionButtons.jsx",
    "src/components/common/AuthModal.jsx",
    "src/components/common/BottomSheet.jsx",
    "src/components/common/BottomTabBar.jsx",
    "src/components/common/CharCounter.jsx",
    "src/components/common/Chip.jsx",
    "src/components/common/ImageUploader.jsx",
    "src/components/common/InfoRow.jsx",
    "src/components/common/LoadingSpinner.jsx",
    "src/components/common/MaintenanceModal.jsx",
    "src/components/common/MapPicker.jsx",
    "src/components/common/PriceBreakdown.jsx",
    "src/components/common/PriceGuideModal.jsx",
    "src/components/common/SearchBar.jsx",
    "src/components/common/StarRating.jsx",
    "src/components/common/SuccessModal.jsx",
    "src/components/common/UpdateModal.jsx",
    "src/components/createbusiness/BasicInfoStep.jsx",
    "src/components/createbusiness/NationalIdVerificationStep.jsx",
    "src/components/createbusiness/StepProgress.jsx",
    "src/components/createbusiness/TeamManagement.jsx",
    "src/components/createbusiness/TermsAndConditionsStep.jsx",
    "src/components/manageBusiness/AppointmentCard.jsx",
    "src/components/manageBusiness/AppointmentDetailSheet.jsx",
    "src/components/manageBusiness/AppointmentFilters.jsx",
    "src/components/manageBusiness/AppointmentSearchBar.jsx",
    "src/components/manageBusiness/CancelReasonModal.jsx",
    "src/components/manageBusiness/QuickAccessGrid.jsx",
    "src/components/manageBusiness/VerifyCodeModal.jsx",
    "src/components/manageBusiness/appointments/AppointmentListItem.jsx",
    "src/components/manageBusiness/appointments/AppointmentsList.jsx",
    "src/components/manageBusiness/appointments/VerifyServiceCodeModal.jsx",
    "src/components/manageBusiness/bookingLink/BookingLinkCard.jsx",
    "src/components/manageBusiness/bookingLink/QRCodeSection.jsx",
    "src/components/manageBusiness/bookingLink/ShareBookingLinkModal.jsx",
    "src/components/manageBusiness/financial/BankEditModal.jsx",
    "src/components/manageBusiness/financial/BankInfoCard.jsx",
    "src/components/manageBusiness/financial/FinancialTabs.jsx",
    "src/components/manageBusiness/financial/TransactionDetailModal.jsx",
    "src/components/manageBusiness/financial/TransactionItem.jsx",
    "src/components/manageBusiness/lineRental/CreateLineRentalAdSheet.jsx",
    "src/components/manageBusiness/lineRental/LineRentalAdCard.jsx",
    "src/components/manageBusiness/lineRental/LineRentalDetailModal.jsx",
    "src/components/manageBusiness/lineRental/LineRentalStats.jsx",
    "src/components/manageBusiness/modelRequest/ModelRequestCard.jsx",
    "src/components/manageBusiness/modelRequest/ModelRequestDetailModal.jsx",
    "src/components/manageBusiness/modelRequest/ModelRequestForm.jsx",
    "src/components/manageBusiness/modelRequest/ModelRequestStats.jsx",
    "src/components/manageBusiness/portfolio/PortfolioCard.jsx",
    "src/components/manageBusiness/portfolio/PortfolioDetailModal.jsx",
    "src/components/manageBusiness/portfolio/PortfolioFormSheet.jsx",
    "src/components/manageBusiness/reminders/ReminderCustomerCard.jsx",
    "src/components/manageBusiness/reminders/ReminderEmptyState.jsx",
    "src/components/manageBusiness/reminders/ReminderList.jsx",
    "src/components/manageBusiness/reminders/ReminderMessagePreview.jsx",
    "src/components/manageBusiness/reminders/ReminderStats.jsx",
    "src/components/manageBusiness/reminders/ReminderTabs.jsx",
    "src/components/manageBusiness/reminders/SendReminderModal.jsx",
    "src/components/manageBusiness/schedule/CalendarStep.jsx",
    "src/components/manageBusiness/schedule/ScheduleModal.jsx",
    "src/components/manageBusiness/schedule/ServiceSelectionStep.jsx",
    "src/components/manageBusiness/schedule/StepIndicator.jsx",
    "src/components/manageBusiness/schedule/TimePickerField.jsx",
    "src/components/manageBusiness/schedule/WorkingHoursStep.jsx",
    "src/components/manageBusiness/services/ServiceCard.jsx",
    "src/components/manageBusiness/services/ServiceHeader.jsx",
    "src/components/manageBusiness/services/ServiceStats.jsx",
    "src/components/manageBusiness/services/ServicesManagement.jsx",
    "src/components/profile/ProfileHeader.jsx",
    "src/components/profile/ProfileMenuCard.jsx",
    "src/components/profile/ProfileMenuList.jsx",
    "src/components/profile/ProfileStatsCard.jsx",
    "src/components/profile/ThemeToggleItem.jsx",
    "src/components/profile/appointments/AppointmentCompactCard.jsx",
    "src/components/profile/appointments/AppointmentDetailModal.jsx",
    "src/components/profile/appointments/CancelAppointmentModal.jsx",
    "src/components/profile/paymentHistory/InvoiceModal.jsx",
    "src/components/profile/paymentHistory/PaymentCard.jsx",
    "src/components/profile/paymentHistory/PaymentStatsCard.jsx",
    "src/components/profile/support/FaqSection.jsx",
    "src/components/profile/support/SupportChannels.jsx"
]

IMPORT_STATEMENT = "import { useTheme } from '@/stores/useThemeStore';"
HOOK_STATEMENT = "  const { colors } = useTheme();"

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    lines = content.split('\n')
    
    # ۱. بررسی و اضافه کردن Import
    has_use_theme_import = any("useTheme" in line and "from '@/stores/useThemeStore'" in line for line in lines)
    
    if not has_use_theme_import:
        last_import_idx = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import_idx = i
        
        if last_import_idx != -1:
            lines.insert(last_import_idx + 1, IMPORT_STATEMENT)
        else:
            if lines and ('use client' in lines[0]):
                lines.insert(1, IMPORT_STATEMENT)
            else:
                lines.insert(0, IMPORT_STATEMENT)

    content = '\n'.join(lines)
    
    # ۲. بررسی و اضافه کردن هوک در ابتدای بدنه کامپوننت
    if "const { colors } = useTheme();" not in content and "const { colors," not in content:
        # پیدا کردن تابع default export
        match = re.search(r"export\s+default\s+function\s+\w+\s*\(", content)
        if match:
            # پیدا کردن اولین { بعد از تعریف تابع برای ورود به بدنه
            brace_idx = content.find("{", match.end())
            if brace_idx != -1:
                content = content[:brace_idx + 1] + "\n" + HOOK_STATEMENT + "\n" + content[brace_idx + 1:]
            else:
                print(f"⚠️ Could not find opening brace for default export in {filepath}")
        else:
            print(f"⚠️ Could not find default export function in {filepath}")

    # ذخیره تغییرات در صورت نیاز
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated: {filepath}")
    else:
        print(f"⏭️ Skipped (already up-to-date): {filepath}")

if __name__ == "__main__":
    print("🚀 Starting theme fix script...")
    for f in FILES:
        process_file(f)
    print("🎉 Done! All files processed.")