const identify = (props) => {
    if (!window.analytics) return;
    try {
        let extraProps = {};

        if (props.investorStatus) {
            extraProps.type = 'INVESTOR';
            extraProps.investorStatus = props.investorStatus;
            extraProps.registrationStep = props.registrationStep;
        }

        if (props.number) {
            window.analytics.identify(props.number, {
                email: props.email,
                firstName: props.firstName,
                lastName: props.lastName,
                phone: props.mobilePhone,
                wallet: props.wallet,
                createdAt: props.createdAt,
                ...extraProps
            });
        } else if (props.email) {
            window.analytics.identify(props.email, {
                email: props.email
            });
        } else {
            window.analytics.identify(props);
        }
    } catch (e) {
        console.error(`Failed to identify investor. [profileNumber=${props.number}]`, e);
    }
};

const trackEvent = (event, params = {}) => {
    if (!window.analytics) return;
    try {
        window.analytics.track(event, params);
    } catch (e) {
        console.error(`Failed to track event: ${event}`, e);
    }
};

const trackPage = (route, location) => {
    if (!window.analytics) return;
    try {
        window.analytics.page({
            title: route.name,
            path: route.path,
            search: location.search,
            referrer: document.referrer,
            url: location.href
        });
    } catch (e) {
        console.error(`Failed to track page: [route=${route}]`, e);
    }
};

export { identify, trackEvent, trackPage };
