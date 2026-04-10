import Head from 'next/head';
import { FaSignOutAlt } from 'react-icons/fa';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AuthPanel from '@/components/espace-client/AuthPanel';
import BorneTab from '@/components/espace-client/BorneTab';
import DashboardTab from '@/components/espace-client/DashboardTab';
import DiscordProfileCompletion from '@/components/espace-client/DiscordProfileCompletion';
import LoyaltyTab from '@/components/espace-client/LoyaltyTab';
import NotificationsTab from '@/components/espace-client/NotificationsTab';
import OrdersTab from '@/components/espace-client/OrdersTab';
import ProfileTab from '@/components/espace-client/ProfileTab';
import ReservationsTab from '@/components/espace-client/ReservationsTab';
import TabsNav from '@/components/espace-client/TabsNav';
import { useEspaceClient } from '../hooks/useEspaceClient';

export default function EspaceClientPage() {
  const state = useEspaceClient();

  if (!state.token) {
    return (
      <>
        <Head>
          <title>Connexion | Hookies</title>
        </Head>
        <main className="text-white">
          <Header />
          <AuthPanel
            error={state.error}
            successMessage={state.successMessage}
            discordLoginUrl={state.discordLoginUrl}
          />
          <Footer />
        </main>
      </>
    );
  }

  if (state.needsDiscordProfileCompletion) {
    return (
      <>
        <Head>
          <title>Finaliser le profil | Hookies</title>
        </Head>
        <main className="text-white">
          <Header />
          <DiscordProfileCompletion
            error={state.error}
            successMessage={state.successMessage}
            form={state.discordProfileForm}
            setForm={state.setDiscordProfileForm}
            onSubmit={state.submitDiscordProfileCompletion}
            loading={state.loading.completeProfile}
            onLogout={state.handleLogout}
          />
          <Footer />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Espace Client | Hookies</title>
      </Head>
      <main className="text-white">
        <Header />

        <section className="px-4 py-8 md:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl font-black text-amber-200">Bienvenue, {state.user?.name}</h1>
                <p className="mt-2 text-slate-300">{state.user?.email || ''}</p>
              </div>
              <button
                onClick={state.handleLogout}
                className="flex items-center gap-2 rounded-lg border border-amber-500/40 px-4 py-2 font-semibold text-amber-200 transition hover:bg-amber-500/15"
              >
                <FaSignOutAlt className="h-4 w-4" /> Déconnexion
              </button>
            </div>

            <TabsNav activeTab={state.activeTab} setActiveTab={state.setActiveTab} />

            {state.error && (
              <div className="mb-4 rounded-lg border border-red-600/50 bg-red-950/30 px-4 py-3 text-red-200">
                {state.error}
              </div>
            )}
            {state.successMessage && (
              <div className="mb-4 rounded-lg border border-green-600/50 bg-green-950/30 px-4 py-3 text-green-200">
                {state.successMessage}
              </div>
            )}

            {state.activeTab === 'dashboard' && (
              <DashboardTab
                userName={state.user?.name}
                userRole={state.user?.role}
                loyaltyPoints={state.user?.loyaltyPoints || 0}
                orders={state.orders}
                reservations={state.reservations}
                openingLabel={state.openingStatus.label}
                isOpen={state.openingStatus.isOpen}
                onGoBorne={() => state.setActiveTab('borne')}
              />
            )}

            {state.activeTab === 'borne' && (
              <BorneTab
                loadingMenu={state.loading.menu}
                categories={state.categories}
                selectedCategory={state.selectedCategory}
                setSelectedCategory={state.setSelectedCategory}
                filteredMenu={state.filteredMenu}
                favorites={state.favorites}
                onToggleFavorite={state.toggleFavorite}
                reviewDrafts={state.reviewDrafts}
                onSetReviewDraft={state.setReviewDraft}
                onSubmitReview={state.submitReview}
                onAddToCart={state.addToCart}
                cart={state.cart}
                onUpdateQuantity={state.updateCartQuantity}
                selectedType={state.selectedType}
                onSelectType={state.setSelectedType}
                addresses={state.addresses}
                selectedAddressId={state.selectedAddressId}
                onSelectAddress={state.setSelectedAddressId}
                promoState={state.promoState}
                onApplyPromo={state.applyPromoCode}
                onClearPromo={state.clearPromoCode}
                cartTotal={state.cartTotal}
                finalTotal={state.finalTotal}
                scheduledFor={state.scheduledFor}
                onSetScheduledFor={state.setScheduledFor}
                loadingPromo={state.loading.promo}
                loadingOrder={state.loading.order}
                onSubmitOrder={state.submitOrder}
              />
            )}

            {state.activeTab === 'reservations' && (
              <ReservationsTab
                loadingData={state.loading.data}
                loadingReservation={state.loading.reservation}
                reservationForm={state.reservationForm}
                setReservationForm={state.setReservationForm}
                reservations={state.reservations}
                onSubmit={state.createReservation}
              />
            )}

            {state.activeTab === 'commandes' && (
              <OrdersTab
                loadingData={state.loading.data}
                orders={state.orders}
                selectedOrderId={state.selectedOrderId}
                setSelectedOrderId={state.setSelectedOrderId}
              />
            )}

            {state.activeTab === 'profil' && (
              <ProfileTab
                user={state.user}
                profileForm={state.profileForm}
                setProfileForm={state.setProfileForm}
                loadingProfile={state.loading.profile}
                onSubmitProfile={state.updateProfile}
                addressForm={state.addressForm}
                setAddressForm={state.setAddressForm}
                loadingAddress={state.loading.address}
                addresses={state.addresses}
                onSubmitAddress={state.createAddress}
                onSetDefaultAddress={state.setDefaultAddress}
                onDeleteAddress={state.deleteAddress}
              />
            )}

            {state.activeTab === 'fidelite' && (
              <LoyaltyTab
                userName={state.user?.name}
                points={state.user?.loyaltyPoints || 0}
                referralCode={`HOOK-${(state.user?.id || '0000').slice(0, 6).toUpperCase()}`}
                token={state.token!}
              />
            )}

            {state.activeTab === 'notifications' && (
              <NotificationsTab token={state.token} />
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
